/* eslint-disable @typescript-eslint/no-require-imports -- Browser regression checks. */
const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base=process.env.TEST_BASE_URL || 'http://localhost:3112';
(async()=>{const b=await chromium.launch({channel:'chrome'});const p=await b.newPage({viewport:{width:1440,height:1000}});try{
 await p.goto(base);const nav=p.getByRole('navigation',{name:'Main navigation',exact:true});
 assert.deepEqual(await nav.locator(':scope > ul > li').evaluateAll(items=>items.map(item=>item.firstElementChild.textContent.trim())),['Home','Company','Services','Classes','Contact']);
 await nav.getByRole('button',{name:'Company',exact:true}).click();
 assert.deepEqual(await nav.locator('ul ul:visible a').allTextContents(),['About Us','Work','Careers','Insights']);
 await nav.getByRole('link',{name:'Insights',exact:true}).click();await p.waitForURL('**/insights');
 await nav.getByRole('button',{name:'Services',exact:true}).click();await nav.getByRole('link',{name:'Products',exact:true}).click();await p.waitForURL('**/products');
 for(const width of [1440,1024,390]){await p.setViewportSize({width,height:900});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
 await p.getByRole('button',{name:'Open navigation menu'}).click();const mobile=p.getByRole('navigation',{name:'Mobile navigation',exact:true});await mobile.getByRole('button',{name:'Company',exact:true}).click();await mobile.getByRole('link',{name:'Careers',exact:true}).click();await p.waitForURL('**/careers');
 await p.setViewportSize({width:1440,height:1000});await p.goto(base+'/contact');
 for(const theme of ['light','dark']){await p.evaluate(t=>document.documentElement.classList.toggle('dark',t==='dark'),theme);await p.locator('header').screenshot({path:`.next/final-header-${theme}.png`});await p.locator('footer').screenshot({path:`.next/final-footer-${theme}.png`});}
 assert(await p.locator('header img').first().evaluate(img=>img.complete&&img.naturalWidth>0));
 console.log('Exact menu order, desktop/mobile dropdown destinations, responsive widths, and logo loading passed.');
}finally{await b.close();}})().catch(e=>{console.error(e.message);process.exitCode=1;});
