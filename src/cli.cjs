'use strict';
const fs=require('node:fs'); const path=require('node:path');
const {evaluate,markdown}=require('./evaluate.cjs');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.resolve(root,p),'utf8');
const save=(p,v)=>{const dest=path.resolve(root,p);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,v)};
function main(args){
 const command=args.shift(), opts={};
 while(args.length){const key=args.shift(); if(!key.startsWith('--')||!args.length)throw new Error('Expected --name value');opts[key.slice(2)]=args.shift()}
 const allowed={demo:[],prepare:['split','prompt'],evaluate:['split','input','model','prompt','run']};
 if(!allowed[command])throw new Error('Commands: demo, prepare, evaluate. See README.md.');
 for(const k of Object.keys(opts))if(!allowed[command].includes(k))throw new Error('Unknown option: '+k);
 const split=opts.split||'development';if(!['development','held_out'].includes(split))throw new Error('Invalid split');
 const all=JSON.parse(read('data/tickets.json')); const cases=all.filter(c=>c.split===split);
 if(command==='prepare'){
  const version=opts.prompt||'revised';if(!['baseline','revised'].includes(version))throw new Error('Unknown prompt version');
  const template=read('prompts/'+version+'.txt'), policy=read('prompts/policy.txt'), contract=read('schemas/response.schema.json');
  // Callback substitution prevents ticket text such as $& from changing replacements.
  const requests=cases.map(c=>({id:c.id,prompt:template.replace(/{{(policy|contract|ticket)}}/g,(_,k)=>({policy,contract,ticket:c.ticket})[k])}));
  save('results/local/requests.jsonl',requests.map(JSON.stringify).join('\n')+'\n');console.log('Prepared '+requests.length+' requests in results/local/requests.jsonl');return;
 }
 let records,meta,dest;
 if(command==='demo'){
  records=JSON.parse(read('examples/fixture-responses.json'));meta={mode:'ILLUSTRATIVE FIXTURES - no model called',split:'development',model:'none',prompt:'none'};dest='results/demo';
 }else{
  for(const k of ['input','model','prompt','run'])if(!opts[k])throw new Error('Required option: --'+k);
  records=read(opts.input).trim().split(/\r?\n/).filter(Boolean).map((line,i)=>{try{return JSON.parse(line)}catch{throw new Error('Invalid input JSONL at line '+(i+1))}});
  meta={mode:'User supplied model outputs',split,model:opts.model,prompt:opts.prompt,run:opts.run,date:new Date().toISOString()};dest='results/local';
 }
 const report=evaluate(cases,records);save(dest+'/report.json',JSON.stringify({metadata:meta,...report},null,2)+'\n');save(dest+'/report.md',markdown(report,meta));console.log(JSON.stringify(report.totals,null,2));console.log(report.notice);
}
if(require.main===module){try{main(process.argv.slice(2))}catch(e){console.error(e.message);process.exitCode=1}}
module.exports={main};
