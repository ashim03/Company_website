/* eslint-disable @typescript-eslint/no-require-imports -- Requested targeted CMS update. */
require('dotenv').config();
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base=process.env.TEST_BASE_URL || 'https://www.codastralabs.com.np';
const about='We build software, shape brands, and help businesses grow through digital marketing. Our practical classes turn new skills into real work.';
(async()=>{const b=await chromium.launch({channel:'chrome'});const p=await b.newPage();try{
 await p.goto(base+'/admin/login');await p.getByLabel('Email',{exact:true}).fill(process.env.SEED_ADMIN_EMAIL);await p.getByLabel('Password',{exact:true}).fill(process.env.SEED_ADMIN_PASSWORD);await p.getByRole('button',{name:'Sign in',exact:true}).click();await p.waitForURL('**/admin',{timeout:60000});await p.goto(base+'/admin/settings');
 await p.locator('[name="footer_about"]').fill(about);await p.locator('[name="footer_copyright"]').fill('© 2026 CodAstra Labs Pvt. Ltd. All rights reserved.');
 const response=p.waitForResponse(r=>r.request().method()==='POST');await p.getByRole('button',{name:'Save settings',exact:true}).click();await response;await p.goto(base+'/admin/settings');
 if(await p.locator('[name="footer_about"]').inputValue()!==about)throw new Error('Footer copy did not persist.');
 await p.goto(base+'/',{waitUntil:'domcontentloaded'});await p.locator('footer').getByText(about,{exact:true}).waitFor();console.log('Footer copy saved in CMS and verified publicly.');
}finally{await b.close();}})().catch(e=>{console.error(e.message);process.exitCode=1;});
