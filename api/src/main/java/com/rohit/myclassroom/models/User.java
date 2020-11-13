package com.rohit.myclassroom.models;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(	name = "users", 
		uniqueConstraints = { 
			@UniqueConstraint(columnNames = "username"),
			@UniqueConstraint(columnNames = "email") 
		})

@Getter
@Setter
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotBlank
	@Size(min = 2, max = 15)
	private String firstName;
	
	@NotBlank
	@Size(min = 2, max = 15)
	private String lastName;

	@NotBlank
	@Size(max = 20)
	private String username;

	@NotBlank
	@Size(max = 50)
	@Email
	private String email;

	@NotBlank
	@Size(max = 120)
	private String password;
	
	@OneToMany(mappedBy = "admin", cascade = {
			CascadeType.ALL
	})
	private Set<Classroom> createdClassrooms = new  HashSet<>();
	
	@ManyToMany(mappedBy = "permittedUsers", cascade = {
			CascadeType.ALL
	})
	private Set<Classroom> permittedClassrooms = new HashSet<>();
	
	public User() {
	}

	public User(@NotBlank @Size(min = 2, max = 15) String firstName, 
				@NotBlank @Size(min = 2, max = 15) String lastName,
				@NotBlank @Size(max = 20) String username, 
				@NotBlank @Size(max = 50) @Email String email,
				@NotBlank @Size(max = 120) String password) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.username = username;
		this.email = email;
		this.password = password;
	}
}
