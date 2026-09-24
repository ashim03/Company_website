/* eslint-disable @typescript-eslint/no-require-imports -- Browser integration check. */
require('dotenv').config();
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base=process.env.TEST_BASE_URL || 'http://localhost:3112';
(async()=>{
 const browser=await chromium.launch({channel:'chrome'});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const title=`CMS audit draft ${Date.now()}`;
 let created=false;
 try{
  await page.goto(base+'/services');
  await page.getByRole('link',{name:'Websites',exact:true}).click();
  await page.waitForURL('**/services/websites');
  await page.goto(base+'/products');
  const product=page.getByRole('link').filter({hasText:'open product'}).first();
  const destination=await product.getAttribute('href');
  await product.click(); await page.waitForURL(base+destination);
  await page.goto(base+'/admin/login');
  await page.getByLabel('Email',{exact:true}).fill(process.env.SEED_ADMIN_EMAIL);
  await page.getByLabel('Password',{exact:true}).fill(process.env.SEED_ADMIN_PASSWORD);
  await page.getByRole('button',{name:'Sign in',exact:true}).click();
  await page.waitForURL('**/admin',{timeout:60000});
  await page.goto(base+'/admin/careers');
  await page.getByLabel('Role title',{exact:true}).fill(title);
  await page.getByLabel('Role description and responsibilities').fill('Temporary draft used to verify CMS save and edit behavior.');
  await page.getByRole('button',{name:'Save vacancy'}).click();
  await page.waitForURL('**/admin/careers?ok=1'); created=true;
  await page.getByRole('row').filter({hasText:title}).getByRole('link',{name:'Edit',exact:true}).click();
  assert.equal(await page.getByLabel('Role title',{exact:true}).inputValue(),title);
  await page.getByLabel('Publication status').selectOption('CLOSED');
  await page.getByRole('button',{name:'Save vacancy'}).click();
  await page.waitForURL('**/admin/careers?ok=1');
  const publicPage=await browser.newPage();
  await publicPage.goto(base+'/careers');
  assert.equal(await publicPage.getByText(title).count(),0);
  await publicPage.close();
  console.log('Service/product redirects, vacancy create/edit, and closed-role visibility passed.');
 }finally{
  if(created){
   await page.goto(base+'/admin/careers');
   page.once('dialog',dialog=>dialog.accept());
   await page.getByRole('row').filter({hasText:title}).getByRole('button',{name:'Delete',exact:true}).click();
   await page.getByRole('row').filter({hasText:title}).waitFor({state:'detached'});
   console.log('Temporary draft deleted.');
  }
  await browser.close();
 }
})().catch(e=>{console.error(e.message);process.exitCode=1;});
