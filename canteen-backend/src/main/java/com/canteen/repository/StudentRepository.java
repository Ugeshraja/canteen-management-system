package com.canteen.repository;

import com.canteen.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Student findByEmailAndPassword(String email, String password);
    Student findByNameAndPassword(String name, String password);
    Student findByEmail(String email);
}
