export const formatTimestamp = (_date: any)=>{
    return new Date(_date).toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false ,
    });
   
}