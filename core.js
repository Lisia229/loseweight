export const dayKey=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export const fresh=()=>({version:1,profile:null,days:{},habits:[{id:'situps',name:'仰臥起坐',target:100,unit:'次'}],fast:null,fasts:[],api:''});
export function plan(p,weight=p.weight){
 const bmi=p.goal/(p.height/100)**2;
 if(p.age<18||p.special||bmi<18.5||weight/(p.height/100)**2<18.5)return {error:'這組資料不適合自動減重規劃，請與醫師或營養師討論；仍可使用每日紀錄。'};
 const bmr=10*weight+6.25*p.height-5*p.age+(p.sex==='male'?5:-161),tdee=Math.round(bmr*p.activity),floor=p.sex==='male'?1500:1200;
 if(p.goal>=weight)return {tdee,target:tdee,days:0,deficit:0,maintenance:true};
 const deficit=Math.max(0,Math.min(p.pace*7700/7,tdee*.2,tdee-floor));
 if(deficit<50)return {error:'估計維持熱量偏低，不提供自動熱量赤字。請與營養師討論適合的目標。'};
 return {tdee,target:Math.round(tdee-deficit),deficit:Math.round(deficit),days:Math.ceil((weight-p.goal)*7700/deficit)};
}
export function validState(s){
 const finite=(n,min,max)=>Number.isFinite(n)&&n>=min&&n<=max;
 if(!s||s.version!==1||!s.days||typeof s.days!=='object'||Array.isArray(s.days)||!Array.isArray(s.habits)||!Array.isArray(s.fasts)||typeof s.api!=='string')return false;
 if(s.profile){const p=s.profile;if(!finite(p.age,18,100)||!finite(p.height,120,230)||!finite(p.weight,30,300)||!finite(p.goal,30,300)||!['male','female'].includes(p.sex)||![1.2,1.375,1.55,1.725].includes(p.activity)||![.25,.5].includes(p.pace)||typeof p.special!=='boolean')return false;}
 if(s.fast!==null&&(!Number.isFinite(s.fast)||s.fast<0||s.fast>Date.now()))return false;
 return s.habits.every(h=>typeof h.id==='string'&&typeof h.name==='string'&&typeof h.unit==='string'&&finite(h.target,1,100000))&&new Set(s.habits.map(h=>h.id)).size===s.habits.length&&s.fasts.every(f=>finite(f.start,0,Date.now())&&finite(f.end,f.start,Date.now()))&&Object.entries(s.days).every(([k,d])=>/^\d{4}-\d{2}-\d{2}$/.test(k)&&d&&Array.isArray(d.meals)&&d.checks&&typeof d.checks==='object'&&(d.weight===null||finite(d.weight,30,300))&&Object.values(d.checks).every(v=>finite(v,0,1000000))&&d.meals.every(m=>typeof m.id==='string'&&typeof m.name==='string'&&typeof m.type==='string'&&finite(m.kcal,0,10000)));
}
