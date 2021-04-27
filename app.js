const inquirer  = require('inquirer');
let mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    port: 3306,
    user     : 'root',
    password : 'password',
    database : 'employee_tracker',
    multipleStatements: true
});

connection.connect((err) => {
    if (err) throw err;
    initialQuestions();
  });
  
  const initialQuestions = () => {
    inquirer
        .prompt(
            {
                type: 'list',
                message: 'What do you want to do?',
                name: 'choice',
                choices: [
                  'View All Employees',
                  'View All Employees by Department',
                  'View All Employees by Manager',
                  'View All Roles',
                  'View All Departments',
                  'Add Employee',
                  'Add Role',
                  'Add Department',
                  'Remove Employee',
                  'Remove Role',
                  'Remove Department'
                ]
            })
        .then((response) => {
          const { choice } = response;
          switch (choice) {
            case 'View All Employees':
              viewAllEmployees();
              break;
            case 'View All Employees by Department':
              viewAllEmployeesByDepartment();
              break;
            case 'View All Employees by Manager':
              viewAllEmployeesByManager();
              break;
            case 'View All Roles':
              viewAllRolesWithSalaries();
              break;
            case 'View All Departments':
              viewAllDepartments();
              break;
            case 'Add Employee':
              addEmployee();
              break;
            case 'Add Role':
              addRole();
              break;
            case 'Add Department':
              addDepartment();
              break;
            case 'Remove Employee':
              removeEmployee();
              break;
            case 'Remove Role':
              removeRole();
              break;
            case 'Remove Department':
              removeDepartment();
              break;
          }
        });
  };
  
  const viewAllEmployees = () => {
    const sql = `SELECT
                  emp1.id,
                  emp1.first_name,
                  emp1.last_name,
                  title,
                  salary,
                  CONCAT_WS(" ", emp2.first_name, emp2.last_name) as managers_name,
                  name as department
                  FROM employee emp1
                  LEFT OUTER JOIN employee emp2 on emp1.manager_id=emp2.id
                  INNER JOIN role on emp1.role_id=role.id
                  INNER JOIN department on role.department_id=department.id
                `;
    connection.query(sql, (err, res) => {
        if (err) throw err;
        // console.log(res);
        res.length ? console.table(res) : console.table([{results: 'No Data Found!'}]);
        initialQuestions();
    });
  }
  
  const viewAllEmployeesByDepartment = () => {
    const sql = `SELECT id, name FROM department`;
    connection.query(sql, (err, res) => {
      if (err) throw err;
      let departments = res.map(department => department ? {name: department.name, value: department.id} : '');
      inquirer
          .prompt(
            [
              {
                type: 'list',
                message: 'Department:',
                title: 'choice',
                name: 'department_id',
                choices: departments
              }
            ])
            .then((response) => {
              const { department_id } = response;
              const sql = `SELECT
                  emp1.id,
                  emp1.first_name,
                  emp1.last_name,
                  title,
                  salary,
                  CONCAT_WS(" ", emp2.first_name, emp2.last_name) as managers_name,
                  name as department
                  FROM employee emp1
                  LEFT OUTER JOIN employee emp2 on emp1.manager_id=emp2.id
                  INNER JOIN role on emp1.role_id=role.id
                  INNER JOIN department on role.department_id=department.id
                  WHERE department.id=${department_id}
                `;
                connection.query(sql, (err, res) => {
                    if (err) throw err;
                    res.length ? console.table(res) : console.table([{results: 'No Data Found!'}]);
                    initialQuestions();
                });
            });
    });
  }
  
  const viewAllEmployeesByManager = () => {
    const sql = `SELECT id, first_name, last_name FROM employee`;
    connection.query(sql, (err, res) => {
      if (err) throw err;
      let employees = res.map(employee => employee ? {name: employee.first_name, value: employee.id} : '');
      inquirer
          .prompt(
            [
              {
                type: 'list',
                message: "Manager",
                title: 'choice',
                name: 'manager_id',
                choices: employees
              }
            ])
            .then((response) => {
              const { manager_id } = response;
              // console.log(manager_id);
              const sql = `SELECT
                  emp1.id,
                  emp1.first_name,
                  emp1.last_name,
                  title,
                  salary,
                  CONCAT_WS(" ", emp2.first_name, emp2.last_name) as managers_name,
                  name as department
                  FROM employee emp1
                  LEFT OUTER JOIN employee emp2 on emp1.manager_id=emp2.id
                  INNER JOIN role on emp1.role_id=role.id
                  INNER JOIN department on role.department_id=department.id
                  WHERE emp1.manager_id=${manager_id}
                `;
                connection.query(sql, (err, res) => {
                    if (err) throw err;
                    res.length ? console.table(res) : console.table([{results: 'No Data Found!'}]);
                    initialQuestions();
                });
            });
    });
  }
  
  const viewAllDepartments = () => {
    const sql = `SELECT id, name as department FROM department`;
    connection.query(sql, (err, res) => {
        if (err) throw err;
        res.length ? console.table(res) : console.table([{results: 'No Data Found!'}]);
        initialQuestions();
    });
  }
  
  const viewAllRolesWithSalaries = () => {
    const sql = `SELECT role.id, title, salary, name as department FROM role INNER JOIN department on role.department_id=department.id`;
    connection.query(sql, (err, res) => {
        if (err) throw err;
        res.length ? console.table(res) : console.table([{results: 'No Data Found!'}]);
        initialQuestions();
    });
  }
  
  const addEmployee = () => {
    let getRoles = `SELECT id, title FROM role`;
    let getManagers = `SELECT id, first_name, last_name FROM employee`;
    connection.query(`${getRoles}; ${getManagers}`, [1, 2], (err, res) => {
        if (err) throw err;
        let roles = res[0].map(role => role ? {name: role.title, value: role.id} : '');
        let managers = res[1].length ? res[1].map(manager => manager ? {name: manager.first_name +' '+ manager.last_name, value: manager.id} : '') : [];
        inquirer
          .prompt(
            [{
                  type: 'input',
                  message: 'Firstname:',
                  name: 'first_name',
              },
              {
                  type: 'input',
                  message: 'Lastname:',
                  name: 'last_name',
              },
              {
                type: 'list',
                message: 'Role:',
                title: 'choice',
                name: 'role_id',
                choices: roles
              },
              {
                type: 'list',
                message: 'Manager:',
                title: 'choice',
                name: 'manager_id',
                choices: managers
              },
            ])
            .then((response) => {
              // console.log(response);
              let {first_name, last_name, role_id, manager_id} = response;
              connection.query(
                ` INSERT INTO employee (first_name, last_name, role_id, manager_id)
                  VALUES ('${first_name}', '${last_name}', ${role_id}, ${manager_id})
                `,
                (err) => {
                    if (err) throw err;
                    // console.table(res);
                    console.log('\nSuccessfully Added Employee!\n');
                    viewAllEmployees();
                }
              );
            });
    });
  }
  
  const addRole = () => {
    let getDepartments = `SELECT id, name FROM department`;
    connection.query(`${getDepartments}`, (err, res) => {
      if (err) throw err;
      let departments = res.map(department => department ? {name: department.name, value: department.id} : '');
      inquirer
      .prompt(
        [{
              type: 'input',
              message: 'Role Name:',
              name: 'title',
          },
          {
            type: 'number',
            message: 'Salary:',
            name: 'salary',
          },
          {
            type: 'list',
            message: 'Departments:',
            title: 'choice',
            name: 'department_id',
            choices: departments
          },
        ])
        .then((response) => {
          // console.log(response);
          let { title, salary, department_id} = response;
          connection.query(
            ` INSERT INTO role (title, salary, department_id)
              VALUES ('${title}', '${salary}', '${department_id}')
            `,
            (err) => {
                if (err) throw err;
                console.log('\nSuccessfully Added Role!\n');
                viewAllRolesWithSalaries();
            }
          );
        });
    });
  }
  
  const addDepartment = () => {
    inquirer
      .prompt(
        [{
              type: 'input',
              message: 'Department Name:',
              name: 'name',
          }
        ])
        .then((response) => {
          // console.log(response);
          let { name } = response;
          connection.query(
            ` INSERT INTO department (name)
              VALUES ('${name}')
            `,
            (err) => {
                if (err) throw err;
                console.log('\nSuccessfully Added Department!\n');
                viewAllDepartments();
                console.log('\n');
                // initialQuestions();
            }
          );
        });
  }
  
  const removeEmployee = () => {
    const sql = `SELECT id, first_name, last_name FROM employee`;
    connection.query(sql, (err, res) => {
        if (err) throw err;
        let employees = res.map(employee => employee ? {name: employee.first_name +' '+employee.last_name, value: employee.id} : '');
        inquirer
          .prompt(
            [
              {
                type: 'list',
                message: 'Remove Employee Name:',
                title: 'choice',
                name: 'employee_id',
                choices: employees
              },
            ])
            .then((response) => {
              // console.log(response);
              let { employee_id } = response;
              connection.query(
                ` DELETE FROM employee WHERE id='${employee_id}'
                `,
                (err) => {
                    if (err) throw err;
                    // console.table(res);
                    console.log('\nSuccessfully Deleted Employee!\n');
                    viewAllEmployees();
                }
              );
            });
    });
  }
  
  const removeRole = () => {
    const sql = `SELECT id, title FROM role`;
    connection.query(sql, (err, res) => {
        if (err) throw err;
        let roles = res.map(role => role ? {name: role.title, value: role.id} : '');
        inquirer
          .prompt(
            [
              {
                type: 'list',
                message: 'Remove Role:',
                title: 'choice',
                name: 'role_id',
                choices: roles
              },
            ])
            .then((response) => {
              // console.log(response);
              let { role_id } = response;
              connection.query(
                ` DELETE FROM role WHERE id='${role_id}'
                `,
                (err) => {
                    if (err) throw err;
                    // console.table(res);
                    console.log('\nSuccessfully Deleted Role!\n');
                    viewAllRolesWithSalaries();
                }
              );
            });
    });
  }
  
  const removeDepartment = () => {
    const sql = `SELECT id, name FROM department`;
    connection.query(sql, (err, res) => {
        if (err) throw err;
        let departments = res.map(department => department ? {name: department.name, value: department.id} : '');
        inquirer
          .prompt(
            [
              {
                type: 'list',
                message: 'Remove Department:',
                title: 'choice',
                name: 'department_id',
                choices: departments
              },
            ])
            .then((response) => {
              // console.log(response);
              let { department_id } = response;
              connection.query(
                ` DELETE FROM department WHERE id='${department_id}'
                `,
                (err) => {
                    if (err) throw err;
                    // console.table(res);
                    console.log('\nSuccessfully Deleted Department!\n');
                    viewAllDepartments();
                }
              );
            });
    });
};

// connection.connect(function(err){
//     if (err) throw err;
//     connection.end();
// });

