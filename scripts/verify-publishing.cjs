/* eslint-disable @typescript-eslint/no-require-imports -- Explicit reversible live CMS check. */
require('dotenv').config();
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base=process.env.TEST_BASE_URL || 'http://localhost:3112';
(async()=>{
 const b=await chromium.launch({channel:'chrome'});const p=await b.newPage();const site=await b.newPage();p.setDefaultTimeout(60000);site.setDefaultTimeout(60000);let original;
 const toggle=async(name,checked)=>{const el=p.getByRole('switch',{name,exact:true});if(await el.isChecked()!==checked)await el.locator('..').click();};
 const save=async()=>{const response=p.waitForResponse(r=>r.request().method()==='POST');await p.getByRole('button',{name:'Save settings',exact:true}).click();await response;await p.goto(base+'/admin/settings');};
 try{
  await p.goto(base+'/admin/login');await p.getByLabel('Email',{exact:true}).fill(process.env.SEED_ADMIN_EMAIL);await p.getByLabel('Password',{exact:true}).fill(process.env.SEED_ADMIN_PASSWORD);await p.getByRole('button',{name:'Sign in',exact:true}).click();await p.waitForURL('**/admin',{timeout:60000});await p.goto(base+'/admin/settings');
  original={social:await p.getByRole('switch',{name:'Publish social links',exact:true}).isChecked(),map:await p.getByRole('switch',{name:'Publish company map',exact:true}).isChecked(),extra:JSON.parse(await p.locator('[name="social_extra"]').inputValue())};
  await toggle('Publish social links',false);await toggle('Publish company map',false);await save();
  assert.equal(await p.getByRole('switch',{name:'Publish social links',exact:true}).isChecked(),false);
  assert.equal(await p.getByRole('switch',{name:'Publish company map',exact:true}).isChecked(),false,'Map state saved');
  await site.goto(base+'/contact',{waitUntil:'domcontentloaded'});assert.equal(await site.locator('iframe[title="CodAstra Labs company location"]').count(),0,'Unpublished map hidden');assert.equal(await site.locator('footer a[aria-label*="demo link"]').count(),0,'Unpublished social links hidden');console.log('Unpublished socials/map hidden and saved.');
  await toggle('Publish social links',true);if(original.extra.length)await p.getByLabel('Published on website',{exact:true}).first().uncheck();await save();await site.goto(base+'/contact');if(original.extra.length)assert.equal(await site.locator('footer').getByRole('link',{name:original.extra[0].label+' (demo link)',exact:true}).count(),0);console.log('Individual social visibility passed.');
 }finally{
  try{if(original){await p.goto(base+'/admin/settings');await toggle('Publish social links',original.social);await toggle('Publish company map',original.map);for(let i=0;i<original.extra.length;i++)await p.getByLabel('Published on website',{exact:true}).nth(i).setChecked(original.extra[i].published!==false);await save();const restored=JSON.parse(await p.locator('[name="social_extra"]').inputValue());assert.deepEqual(restored.map(v=>v.url),original.extra.map(v=>v.url));console.log('Original visibility restored; saved URLs preserved.');}}finally{await b.close();}
 }
})().catch(e=>{console.error(e.message);process.exitCode=1});
