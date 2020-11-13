package com.rohit.myclassroom.models;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.Setter;

import org.apache.commons.lang3.RandomStringUtils; 

@Entity
@Table(	name = "classrooms",
        uniqueConstraints = {
        	@UniqueConstraint(columnNames = "uid")	
        })

@Getter
@Setter
public class Classroom {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NotBlank
	@Size(min = 2, max = 35)
	private String name;
	
	@Size(min = 0, max = 250)
	private String description;
	
	@NotBlank
	private String uid;
	
	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "admin_id")
	private User admin;
	
	@JsonIgnore
	@ManyToMany
	@JoinTable(
			name = "classroom_users",
			joinColumns = @JoinColumn(name = "classroom_id"),
			inverseJoinColumns = @JoinColumn(name = "user_id"))
	private Set<User> permittedUsers = new HashSet<User>();
	
	@JsonIgnore
	private Boolean allowAll;
	
	public Classroom(){	
	}

	public Classroom(@NotBlank @Size(min = 2, max = 35) String name, 
			         @Size(min = 0, max = 250) String description) {
		this.name = name;
		this.description = description;
		this.uid = RandomStringUtils.random(8, true, true);
		this.allowAll = true;
	}
}
