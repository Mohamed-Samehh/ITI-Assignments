import json
from car import Car
from person import Employee
from office import Office


# Q2) Implement Employee Methods
fiat = Car("Fiat 128")
samy = Employee(1, "Samy", "samy@iti.eg", 5000, fiat, distanceToWork=20)

samy.sleep(7)
print(samy.mood)

samy.eat(3)
print(samy.healthRate)

samy.buy(2)
print(samy.money)

samy.work(8)
print(samy.mood)

samy.send_mail("manager@iti.eg", "Daily Report", "tasks done for today", "Manager")


# Q3) Implement Car Methods
fiat.run(60, 20)
print(fiat.fuelRate)

samy.refuel(20)
print(fiat.fuelRate)

samy.drive(20)


# Q3) Implement Office Methods
iti = Office("ITI Smart Village")
iti.hire(samy)

print(iti.get_all_employees())
print(iti.get_employee(1))

iti.check_lateness(1, moveHour=8)
iti.check_lateness(1, moveHour=9)

iti.reward(1, 500)
print(samy.salary)

iti.deduct(1, 200)
print(samy.salary)


# Save Office Data as JSON
data = {
    "office": iti.name,
    "employees": [emp.to_dict() for emp in iti.get_all_employees()]
}

with open("iti_office.json", "w") as f:
    json.dump(data, f, indent=4)

print("saved to iti_office.json")
