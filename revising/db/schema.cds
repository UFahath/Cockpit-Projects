namespace myapp.db;
using { cuid  } from '@sap/cds/common';


entity TypeTest:cuid{
        //cuid,uuid-->36 Character
        hasMuruganUsedColin:Boolean;//true ,false,null,0,1
        number:Integer;//15 character in sqlite
        number16:Int16; //-32768--32767
        number32:Int32; //10 character (2147483647)
}