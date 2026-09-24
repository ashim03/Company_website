/* eslint-disable @typescript-eslint/no-require-imports -- Explicit CMS configuration runner. */
require('dotenv').config();
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
if(!process.argv.includes('--apply')) throw new Error('Pass --apply to update the requested CMS navigation.');
const base=process.env.TEST_BASE_URL || 'https://www.codastralabs.com.np';
(async()=>{
 const b=await chromium.launch({channel:'chrome'});const p=await b.newPage();p.setDefaultTimeout(30000);
 try{
  await p.goto(base+'/admin/login');await p.getByLabel('Email',{exact:true}).fill(process.env.SEED_ADMIN_EMAIL);await p.getByLabel('Password',{exact:true}).fill(process.env.SEED_ADMIN_PASSWORD);await p.getByRole('button',{name:'Sign in',exact:true}).click();await p.waitForURL('**/admin',{timeout:60000});
  const rows=async()=>{await p.goto(base+'/admin/navigation');return p.locator('tbody tr').evaluateAll(rows=>rows.map(row=>{const cells=row.querySelectorAll('td');const href=row.querySelector('a')?.getAttribute('href');return {label:cells[0].textContent.trim().replace(/^↳\s*/,''),child:cells[0].textContent.includes('↳'),url:cells[1].textContent.trim(),id:href?.split('/')[3]};}));};
  const ensure=async(label,url,order,parent='',forceNew=false)=>{
   let all=await rows();let item=all.find(r=>r.label===label && r.url===url && (!parent?!r.child:forceNew?r.child:true));
   if(!item && !forceNew && label==='About Us')item=all.find(r=>r.url===url && r.label!=='Company');
   if(item){await p.goto(base+`/admin/navigation/${item.id}/edit`);await p.getByRole('heading',{name:`Edit · ${item.label}`,exact:true}).waitFor();}
   await p.locator('[name="label"]').fill(label);await p.locator('[name="url"]').fill(url);await p.locator('[name="sortOrder"]').fill(String(order));await p.locator('[name="parentId"]').selectOption(parent);
   const visible=p.getByRole('switch',{name:'Visible on site',exact:true});if(!await visible.isChecked())await visible.locator('..').click();
   const response=p.waitForResponse(r=>r.request().method()==='POST');await p.getByRole('button',{name:item?'Save changes':'Add item',exact:true}).click();await response;
   all=await rows();item=all.find(r=>r.label===label && r.url===url && r.child===Boolean(parent));if(!item)throw new Error(`Could not configure ${label}`);console.log('Configured:',label,parent?'dropdown item':'top level');return item.id;
  };
  await ensure('Home','/',1);
  const company=await ensure('Company','/company',2);
  const services=await ensure('Services','/services',3);
  await ensure('Classes','/classes',4);await ensure('Contact','/contact',5);
  await ensure('About Us','/company',1,company);
  await ensure('Work','/work',2,company);await ensure('Careers','/careers',3,company);await ensure('Insights','/insights',4,company);
  await ensure('Services','/services',1,services,true);await ensure('Products','/products',2,services);
 }finally{await b.close();}
})().catch(e=>{console.error(e.message);process.exitCode=1;});

