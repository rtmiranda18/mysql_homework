DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,5) NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name DECIMAL(10,5) NULL,
  role_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO department (name)
VALUES ("Human Resource");

INSERT INTO department (name)
VALUES ("Sales");

INSERT INTO department (name)
VALUES ("Accounting");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", "$150,000", "18");

INSERT INTO role (title, salary, department_id)
VALUES ("Employee", "90,000", "25")

INSERT INTO role (title, salary, department_id)
VALUES ("Intern", "30,000", "5")

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", "$150,000", "18");

SELECT * FROM role;