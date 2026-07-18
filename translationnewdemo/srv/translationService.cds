// using {languagesCodes.db as db} from '../db/languages';
 
service TranslationService{
    function getTranslate(text:String,la:String) returns String;
}