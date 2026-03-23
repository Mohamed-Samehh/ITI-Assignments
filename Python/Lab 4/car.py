class Car:
    def __init__(self, name, fuelRate=100, velocity=0):
        self.name = name
        self.fuelRate = fuelRate
        self.velocity = velocity

    @property
    def velocity(self):
        return self._velocity

    @velocity.setter
    def velocity(self, v):
        if not (0 <= v <= 200):
            raise ValueError("velocity must be 0-200")
        self._velocity = v

    @property
    def fuelRate(self):
        return self._fuelRate

    @fuelRate.setter
    def fuelRate(self, f):
        if not (0 <= f <= 100):
            raise ValueError("fuelRate must be 0-100")
        self._fuelRate = f

    def run(self, velocity, distance):
        self.velocity = velocity
        segments = distance // 10
        fuel_needed = segments * 10

        if self._fuelRate <= 0:
            print("no fuel")
            self.stop(distance)
            return

        if fuel_needed >= self._fuelRate:
            covered = (self._fuelRate / 10) * 10
            self._fuelRate = 0
            self.stop(distance - covered)
        else:
            self._fuelRate -= fuel_needed
            self.stop(0)

    def stop(self, remaining=0):
        self.velocity = 0
        if remaining > 0:
            print(f"{self.name} stopped, {remaining:.0f} km remaining")
        else:
            print(f"{self.name} arrived")

    def __repr__(self):
        return f"Car(name={self.name}, fuel={self._fuelRate}%, speed={self._velocity})"
