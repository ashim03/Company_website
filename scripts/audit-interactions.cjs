/* eslint-disable @typescript-eslint/no-require-imports -- Browser audit runner. */
require('dotenv').config();
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base=process.env.TEST_BASE_URL || 'https://www.codastralabs.com.np';
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const failures=[];
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  page.on('pageerror',e=>failures.push(e.message));
  for(const route of ['/','/services','/classes','/company','/products','/work','/contact','/careers','/insights']){
   const response=await page.goto(base+route);
   if(response.status()!==200) failures.push(`${route}: ${response.status()}`);
   const links=page.locator('main a, main button');
   let checked=0;
   for(let i=0;i<await links.count();i++){
    const el=links.nth(i);
    if(!await el.isVisible() || !await el.isEnabled())continue;
    if(await el.evaluate(node=>Boolean(node.closest('[aria-hidden="true"], [inert]'))))continue;
    const label=(await el.innerText()).trim().slice(0,60);
    try{await el.click({trial:true,timeout:8000});checked++;}
    catch(e){failures.push(`${route}: blocked ${label}: ${e.message}`);}
   }
   console.log(route, 'reachable controls:',checked);
  }
  await page.setViewportSize({width:390,height:844});
  await page.goto(base);
  await page.getByRole('button',{name:'Open navigation menu'}).click();
  await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'Classes',exact:true}).click();
  await page.waitForURL('**/classes');
  console.log('Mobile navigation redirects correctly');
  console.log('Public interaction failures:', JSON.stringify(failures));
  if(process.env.SKIP_AUTH === '1') { if(failures.length) process.exitCode=1; return; }
  await page.goto(base+'/admin/login');
  await page.getByLabel('Email',{exact:true}).fill(process.env.SEED_ADMIN_EMAIL);
  await page.getByLabel('Password',{exact:true}).fill(process.env.SEED_ADMIN_PASSWORD);
  await page.getByRole('button',{name:'Sign in',exact:true}).click();
  await page.waitForURL('**/admin',{timeout:60000});
  await page.setViewportSize({width:1440,height:1000});
  for(const route of ['/admin','/admin/pages','/admin/navigation','/admin/services','/admin/services/new','/admin/team','/admin/settings','/admin/media','/admin/careers','/admin/products','/admin/projects','/admin/clients','/admin/testimonials','/admin/faqs','/admin/courses','/admin/blog','/admin/users','/admin/enquiries','/admin/enrollments']){
   const response=await page.goto(base+route);
   if(response.status()!==200)failures.push(`${route}: ${response.status()}`);
   const controls=page.locator('main a,main button');
   for(let i=0;i<await controls.count();i++){
    const el=controls.nth(i);
    if(!await el.isVisible() || !await el.isEnabled())continue;
    try{await el.click({trial:true,timeout:8000});}
    catch{failures.push(`${route}: blocked ${(await el.innerText()).slice(0,60)}`);}
   }
   console.log(route,'checked');
  }
  console.log(JSON.stringify({failures},null,2));
  if(failures.length)process.exitCode=1;
 }finally{await browser.close();}
})().catch(e=>{console.error(e.message);process.exitCode=1});
