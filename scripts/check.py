from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,urljoin,unquote
import hashlib,json,re
BASE=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self):super().__init__();self.ignore=0;self.text=[];self.assets=[]
 def handle_starttag(self,t,a):
  a=dict(a)
  if t=='base':raise ValueError('Unexpected base element overrides page-relative assets')
  if t in ('script','style'):self.ignore+=1
  if t in ('script','img') or (t=='link' and a.get('rel')=='stylesheet'):
   u=a.get('src') or a.get('href','')
   if not urlsplit(u).scheme and not u.startswith('//'):self.assets.append(u)
 def handle_endtag(self,t):
  if t in ('script','style'):self.ignore=max(0,self.ignore-1)
 def handle_data(self,d):
  if not self.ignore and d.strip():self.text.append(d.strip())
def inspect(path):
 p=Page();p.feed(path.read_text());return p
if __name__=='__main__':
 errors=[];inventory=json.loads((BASE/'content-inventory.json').read_text())
 for row in inventory:
  p=inspect(BASE/row['path'])
  digest=hashlib.sha256('\n'.join(p.text).encode()).hexdigest()
  if digest!=row['text_sha256']:errors.append('Changed text: '+row['path'])
  for a in p.assets:
   for mount in ('/', '/duevio-website/'):
    page_url='https://example.test'+mount+row['path']
    resolved=urlsplit(urljoin(page_url,a)).path
    if not resolved.startswith(mount):
     errors.append('Asset escapes site path: '+row['path']+' -> '+a);continue
    if not (BASE/unquote(resolved[len(mount):])).is_file():errors.append('Missing asset: '+row['path']+' -> '+a)
 for lang in ('en','it','mt','de','es','fr','ru'):json.loads((BASE/'assets/i18n'/f'{lang}.json').read_text())
 if errors:raise SystemExit('\n'.join(sorted(set(errors))))
 print(f'OK: {len(inventory)} pages, original text fingerprints, assets at domain root and /duevio-website/, and 7 translation files.')
