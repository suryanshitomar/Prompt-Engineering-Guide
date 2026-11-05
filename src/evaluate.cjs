'use strict';
const keys = ['category','missing_fields','needs_review','reply'];
function validate(value) {
  const errors=[];
  if (!value || typeof value !== 'object' || Array.isArray(value)) return ['Response must be an object'];
  if (JSON.stringify(Object.keys(value).sort()) !== JSON.stringify(keys)) errors.push('Exactly four contract keys required');
  if (!['billing','access','other'].includes(value.category)) errors.push('Invalid category');
  if (typeof value.needs_review !== 'boolean') errors.push('needs_review must be boolean');
  if (!Array.isArray(value.missing_fields) || value.missing_fields.some(x=>!['order_id','days_since_delivery'].includes(x)) || new Set(value.missing_fields).size !== value.missing_fields.length) errors.push('Invalid missing_fields');
  if (typeof value.reply !== 'string' || !value.reply.trim()) errors.push('reply must be nonempty');
  return errors;
}
const sameSet=(a,b)=>Array.isArray(a)&&JSON.stringify([...a].sort())===JSON.stringify([...b].sort());
function evaluate(cases, records) {
  const known=new Set(cases.map(x=>x.id)), byId=new Map();
  if (known.size!==cases.length) throw new Error('Duplicate dataset ID');
  for(const row of records){
    if(!known.has(row.id)) throw new Error('Unknown or wrong-split response ID: '+row.id);
    if(byId.has(row.id)) throw new Error('Duplicate response ID: '+row.id);
    byId.set(row.id,row);
  }
  const rows=cases.map(c=>{
    const record=byId.get(c.id); let response=record?.response; let errors=[];
    if(!record) errors=['Missing response'];
    else {if(typeof response==='string'){try{response=JSON.parse(response)}catch{errors=['Invalid JSON']}} if(!errors.length) errors=validate(response)}
    const valid=errors.length===0;
    const routing=valid&&response.category===c.expected.category;
    const review=valid&&response.needs_review===c.expected.needs_review;
    const fields=valid&&sameSet(response.missing_fields,c.expected.missing_fields);
    const length=valid&&response.reply.trim().split(/\s+/u).length<=90;
    return {id:c.id,contract:valid,routing,review,fields,length,pass:valid&&routing&&review&&fields&&length,errors};
  });
  const totals={cases:cases.length,responses:records.length};
  for(const metric of ['contract','routing','review','fields','length','pass']) totals[metric]=rows.filter(r=>r[metric]).length;
  return {totals,rows,notice:'Automated checks do not assess semantic policy compliance or reply usefulness. Human review required.'};
}
function markdown(report, meta){
  const t=report.totals;
  return '# Evaluation report\n\n'+Object.entries(meta).map(([k,v])=>'- '+k+': '+v).join('\n')+'\n\n| Check | Passed | Total |\n| --- | ---: | ---: |\n'+['contract','routing','review','fields','length','pass'].map(k=>'| '+k+' | '+t[k]+' | '+t.cases+' |').join('\n')+'\n\n'+report.notice+'\n\n## Case results\n\n| ID | Pass | Details |\n| --- | --- | --- |\n'+report.rows.map(r=>'| '+r.id+' | '+r.pass+' | '+(r.errors.join('; ')||['routing','review','fields','length'].filter(k=>!r[k]).join(', ')||'Automated checks passed')+' |').join('\n')+'\n';
}
module.exports={validate,evaluate,markdown};
