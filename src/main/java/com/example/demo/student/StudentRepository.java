package com.example.demo.student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
// @ repository not necessary since we typed extends jparepository but we can put it here anyway
@Repository
public interface StudentRepository extends JpaRepository<Student, Long>  {

    @Query("" +
            "SELECT case when count (s) > 0  then " +
            "TRUE ELSE FALSE END " +
            "FROM Student s " +
            "WHERE s.email = ?1")
    Boolean selectExistsEmail(String email);
}
