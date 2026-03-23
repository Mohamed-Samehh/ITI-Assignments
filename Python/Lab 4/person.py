import re


class Person:
    moods = ("happy", "tired", "lazy")

    def __init__(self, name, money=500, mood="happy", healthRate=100):
        self.name = name
        self.money = money
        self.mood = mood
        self.healthRate = healthRate

    @property
    def healthRate(self):
        return self._healthRate

    @healthRate.setter
    def healthRate(self, h):
        if not (0 <= h <= 100):
            raise ValueError("healthRate must be 0-100")
        self._healthRate = h

    def sleep(self, hours):
        if hours == 7:
            self.mood = self.moods[0]
        elif hours < 7:
            self.mood = self.moods[1]
        else:
            self.mood = self.moods[2]

    def eat(self, meals):
        if meals >= 3:
            self._healthRate = 100
        elif meals == 2:
            self._healthRate = 75
        else:
            self._healthRate = 50

    def buy(self, items):
        self.money -= items * 10

    def __repr__(self):
        return f"Person(name={self.name}, mood={self.mood}, health={self._healthRate}%)"


class Employee(Person):
    def __init__(self, emp_id, name, email, salary, car, distanceToWork=20,
                 money=500, mood="happy", healthRate=100):
        super().__init__(name, money, mood, healthRate)
        self.id = emp_id
        self.email = email
        self.salary = salary
        self.car = car
        self.distanceToWork = distanceToWork

    @property
    def salary(self):
        return self._salary

    @salary.setter
    def salary(self, s):
        if s < 1000:
            raise ValueError("salary must be >= 1000")
        self._salary = s

    @property
    def email(self):
        return self._email

    @email.setter
    def email(self, e):
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', e):
            raise ValueError(f"invalid email: {e}")
        self._email = e

    def work(self, hours):
        if hours == 8:
            self.mood = self.moods[0]
        elif hours > 8:
            self.mood = self.moods[1]
        else:
            self.mood = self.moods[2]

    def drive(self, distance):
        speed = self.car._velocity if self.car._velocity > 0 else 60
        self.car.run(speed, distance)

    def refuel(self, gasAmount=100):
        self.car.fuelRate = min(100, self.car._fuelRate + gasAmount)

    def send_mail(self, to, subject, msg, receiver_name):
        content = (
            f"From: {self._email}\n"
            f"To: {to}\n\n"
            f"Hi, {receiver_name}\n"
            f"{msg}\n"
            f"thanks\n\n"
            f"{subject}"
        )
        fname = f"email_{subject.replace(' ', '_')}.txt"
        with open(fname, "w") as f:
            f.write(content)
        print(f"saved to {fname}")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self._email,
            "salary": self._salary,
            "distanceToWork": self.distanceToWork,
            "mood": self.mood,
            "healthRate": self._healthRate,
            "money": self.money,
            "car": self.car.name,
        }

    def __repr__(self):
        return f"Employee(id={self.id}, name={self.name}, email={self._email})"
