class BankAccount
  attr_reader :balance, :owner

  def initialize(owner, initial_balance)
    @owner   = owner
    @balance = initial_balance
    @rate    = 0.05
  end

  def deposit(amount)
    if amount > 0
      # BUG 3 (logic): deposit was taking money away instead of adding it -> FIX: use += instead of -=
      @balance += amount
      puts "  New balance: $#{"%.2f" % @balance}"
    else
      puts "  Error: Deposit amount must be positive."
    end
  end

  # BUG 4 (logic): nothing stopped you from withdrawing more than you have -> FIX: check the balance first and show an error if there's not enough
  def withdraw(amount)
    if amount > @balance
      puts "  Error: Insufficient funds. Balance: $#{"%.2f" % @balance}"
    else
      @balance -= amount
      puts "  New balance: $#{"%.2f" % @balance}"
    end
  # BUG 1 (syntax): forgot to close the withdraw method -> FIX: add "end"
  end

  def apply_interest
    # BUG 5 (logic): this wiped out the balance and left only the interest -> FIX: add the interest on top with +=
    @balance += @balance * @rate
    puts "  New balance: $#{"%.2f" % @balance}"
  end

  def display_info
    puts "Owner  : #{@owner}"
    # BUG 2 (syntax): typed ( instead of { for interpolation -> FIX: use {} and format like the other balance lines
    puts "Balance: $#{"%.2f" % @balance}"
  end
end

# --- Script entry point ---

account = BankAccount.new("Alice", 1000)

puts "=== Account Info ==="
account.display_info
puts

puts "Depositing $500..."
account.deposit(500)
puts

puts "Withdrawing $200..."
account.withdraw(200)
puts

puts "Applying 5% interest..."
account.apply_interest
puts

puts "Attempting to overdraw $2000..."
account.withdraw(2000)
puts
account.display_info

# integration tests