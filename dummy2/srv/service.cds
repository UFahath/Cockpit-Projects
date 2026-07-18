using {myapp.db.Student as Student} from '../db/schema';

service MyService {
 entity Students as projection on Student;
    

} 