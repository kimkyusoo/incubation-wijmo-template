

class BaseRepository{

    constructor(axios, path){

        this.axios = axios
        this.path = path

    }


    async findById(id){
        try{
             let result = await this.axios.get(this.axios.fixUrl(`/${this.path}/${id}`))
             result.data.id = id;
             return result.data;
         }catch(e){
             return null;
         }
     }

     async afterProcess(data){

        let Promises = data.map(async (value) => {
            if(value == null) return
        });
        await Promise.all(Promises);
        for(var i = 0; i < data.length ; i++ ) {
            data[i].index = i;
        }
        return data;

    }

     async find(query) {
         var me = this;
         if(me.offline){
             if(!me.values) me.values = [];
             return;
         } 
         var temp = null;
         if(query!=null){
             temp = await this.axios.get(this.axios.fixUrl('/${this.path}/search/${query.name}'), query.queryParameters);
             me.values = await me.afterProcess(temp.data);
         }else{
             temp = await this.axios.get(this.axios.fixUrl('/${this.path}'))
             me.values = await me.afterProcess(temp.data._embedded.companies);
         }
         return me.values;
     }


    async save(entity, isNew){
        if(isNew) {
            return await this.axios.post(this.axios.fixUrl('/${this.path}'), entity)
        } else {
            return await this.axios.put(this.axios.fixUrl(entity._links.self.href), entity)
        }
        
    }

    async delete(entity){
        await this.this.axios.delete(this.axios.fixUrl(entity._links.self.href))
    }

    async invokeHateoasLink(entity, link, params) {
        return await this.axios.put(this.axios.fixUrl(entity._links[link].href), params)
    }
}


module.exports = BaseRepository