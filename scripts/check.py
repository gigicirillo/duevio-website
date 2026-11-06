from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import hashlib,json,re
BASE=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self):super().__init__();self.ignore=0;self.text=[];self.assets=[]
 def handle_starttag(self,t,a):
  a=dict(a)
  if t in ('script','style'):self.ignore+=1
  if t in ('script','img') or (t=='link' and a.get('rel')=='stylesheet'):
   u=a.get('src') or a.get('href','')
   if u.startswith('/assets/'):self.assets.append(urlsplit(u).path)
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
   if not (BASE/a.lstrip('/')).is_file():errors.append('Missing asset: '+a)
 for lang in ('en','it','mt','de','es','fr','ru'):json.loads((BASE/'assets/i18n'/f'{lang}.json').read_text())
 if errors:raise SystemExit('\n'.join(sorted(set(errors))))
 print(f'OK: {len(inventory)} pages, original text fingerprints, local assets and 7 translation files.')
