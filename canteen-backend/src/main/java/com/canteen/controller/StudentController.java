package com.canteen.controller;

import com.canteen.model.Student;
import com.canteen.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    // Student Login API (checks email or username, and password)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Student loginRequest) {
        String identifier = loginRequest.getEmail();
        if (identifier == null || identifier.trim().isEmpty()) {
            identifier = loginRequest.getName();
        }
        String password = loginRequest.getPassword();

        // 1. Try finding by email and password
        Student student = studentRepository.findByEmailAndPassword(identifier, password);

        // 2. If not found, try finding by name and password
        if (student == null) {
            student = studentRepository.findByNameAndPassword(identifier, password);
        }

        if (student != null) {
            return ResponseEntity.ok(student);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email/username or password!");
        }
    }

    // Student Registration API
    @PostMapping("/register")
    public ResponseEntity<Student> register(@RequestBody Student student) {
        Student savedStudent = studentRepository.save(student);
        return ResponseEntity.ok(savedStudent);
    }

    // Get all students
    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get student by ID
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Optional<Student> studentOptional = studentRepository.findById(id);
        if (studentOptional.isPresent()) {
            return ResponseEntity.ok(studentOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
