

const check = ()=>{
    const scores = {"maths":45,"English":50,"physics":55}
    const subjects =["maths","English","physics"]
    if (!(subjects.includes(Object.keys(scores)[0]) && 
    subjects.includes(Object.keys(scores)[0]) &&
    subjects.includes(Object.keys(scores)[0]) &&
    subjects.includes(Object.keys(scores)[0]))) {
        console.log(`error`);
    } else {
        console.log(`success`);
        const val = Object.values(scores).reduce((a,b)=> {return a+b})
        console.log(val);
    } 
}
check()