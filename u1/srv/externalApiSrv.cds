using {my.db.MyDatas as ext} from '../db/externalApiDb';


service MyApi{
    entity ExternalApi as projection on ext;
    // entity dummy{
    //     key notId:Integer;
    // }
}