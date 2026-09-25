/* eslint-disable @typescript-eslint/no-require-imports -- Auth regression check. */
require('dotenv').config();
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base=process.env.TEST_BASE_URL || 'http://localhost:3112';
(async()=>{
 const browser=await chromium.launch({channel:'chrome'});const page=await browser.newPage();page.setDefaultTimeout(30000);
 const wrongEmail=`login-audit-${Date.now()}@example.com`;
 const fill=async(email,password)=>{await page.getByLabel('Email',{exact:true}).fill(email);await page.getByLabel('Password',{exact:true}).fill(password);};
 const submit=async()=>{const response=page.waitForResponse(r=>r.request().method()==='POST');await page.locator('button[type="submit"]').click();await response;};
 try{
  await page.goto(base+'/admin/login');
  assert.equal(await page.getByLabel('Email',{exact:true}).inputValue(),'');assert.equal(await page.getByLabel('Password',{exact:true}).inputValue(),'');
  await page.getByRole('button',{name:'Show password',exact:true}).click();assert.equal(await page.getByLabel('Password',{exact:true}).getAttribute('type'),'text');await page.getByRole('button',{name:'Hide password',exact:true}).click();
  // Start with a successful login so previous manual/audit failures on this IP
  // cannot change the expected five-attempt boundary.
  await fill(process.env.SEED_ADMIN_EMAIL,process.env.SEED_ADMIN_PASSWORD);await submit();
  await page.waitForFunction(()=>location.pathname==='/admin'||document.querySelector('[role=alert]'));
  if(new URL(page.url()).pathname!=='/admin'){
   await page.getByRole('button',{name:'Sign in',exact:true}).waitFor({timeout:70000});
   await fill(process.env.SEED_ADMIN_EMAIL,process.env.SEED_ADMIN_PASSWORD);await submit();
  }
  await page.waitForURL('**/admin',{timeout:60000});
  await page.getByRole('button',{name:'Sign out',exact:true}).click();await page.waitForURL('**/admin/login');
  console.log('Existing failure history reset by successful sign-in.');
  for(let i=1;i<=5;i++){
   await fill(wrongEmail,'intentionally-incorrect');await submit();
   console.log('Submitted failed attempt',i);
   if(i<5){await page.getByText('Invalid email or password.',{exact:true}).waitFor();await page.waitForFunction(()=>!document.querySelector('button[type=submit]').disabled);}
  }
  await page.getByText(/Too many failed attempts\. Try again in/).waitFor();assert(await page.locator('button[type="submit"]').isDisabled());console.log('Empty fields, password eye toggle, and fifth-failure cooldown passed.');
  await page.reload();await fill(wrongEmail,'intentionally-incorrect');await submit();await page.getByText(/Too many failed attempts\. Try again in/).waitFor();console.log('Reload cannot bypass the server cooldown. Waiting for expiry.');
  await page.getByRole('button',{name:'Sign in',exact:true}).waitFor({timeout:70000});
  await fill(wrongEmail,'intentionally-incorrect');await submit();await page.getByText(/Too many failed attempts\. Try again in/).waitFor();console.log('Next wrong password starts another one-minute cooldown.');
  await page.getByRole('button',{name:'Sign in',exact:true}).waitFor({timeout:70000});
  await fill(process.env.SEED_ADMIN_EMAIL,process.env.SEED_ADMIN_PASSWORD);await submit();await page.waitForURL('**/admin',{timeout:60000});console.log('Correct login succeeds after cooldown and resets failures.');
 }catch(error){console.error('Login state:',await page.locator('[role=alert]').allTextContents(),await page.locator('button[type="submit"]').allTextContents());throw error;}finally{await browser.close();}
})().catch(e=>{console.error(e.message);process.exitCode=1;});
