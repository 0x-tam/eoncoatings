from PIL import Image
from pathlib import Path
import json
for kind in ['desktop','mobile']:
 f=Path('evidence/export-rects-'+kind+'.json')
 if not f.exists():continue
 for name,v in json.loads(f.read_text()).items():
  im=Image.open('evidence/'+kind+'-'+name+'.png');r=v['rect'];sx=im.width/v['width'];sy=im.height/v['height']
  im=im.crop((int(r['x']*sx),int(r['y']*sy),int(r['right']*sx),int(r['bottom']*sy)))
  im.save('public/model/'+name+('-mobile' if kind=='mobile' else '')+'.webp',quality=88)
  im.save('evidence/model-'+kind+'/'+name+'.png')
