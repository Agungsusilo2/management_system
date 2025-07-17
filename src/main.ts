import {web} from "./application/web";
import {logger} from "./application/logging";


web.listen(3000,()=>{
    logger.info("Listening port 3000")
})