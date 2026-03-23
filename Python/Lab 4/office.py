class Office:
    employeesNum = 0

    def __init__(self, name):
        self.name = name
        self.employees = []

    @classmethod
    def change_emps_num(cls, num):
        cls.employeesNum = num

    @staticmethod
    def calculate_lateness(targetHour, moveHour, distance, velocity):
        return (moveHour + distance / velocity) > targetHour

    def get_all_employees(self):
        return self.employees

    def get_employee(self, empId):
        for emp in self.employees:
            if emp.id == empId:
                return emp
        return None

    def hire(self, employee):
        self.employees.append(employee)
        Office.change_emps_num(Office.employeesNum + 1)

    def fire(self, empId):
        emp = self.get_employee(empId)
        if emp:
            self.employees.remove(emp)
            Office.change_emps_num(Office.employeesNum - 1)

    def deduct(self, empId, deduction):
        emp = self.get_employee(empId)
        if emp:
            emp.salary = max(1000, emp._salary - deduction)

    def reward(self, empId, reward_amount):
        emp = self.get_employee(empId)
        if emp:
            emp.salary = emp._salary + reward_amount

    def check_lateness(self, empId, moveHour):
        emp = self.get_employee(empId)
        if not emp:
            return
        late = Office.calculate_lateness(9, moveHour, emp.distanceToWork, 60)
        if late:
            print(f"{emp.name} is late")
            self.deduct(empId, 10)
        else:
            print(f"{emp.name} is on time")
            self.reward(empId, 10)

    def __repr__(self):
        return f"Office(name={self.name}, employees={len(self.employees)})"
