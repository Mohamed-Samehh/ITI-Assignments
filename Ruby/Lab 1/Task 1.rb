print "How many scores? "
n = gets.chomp.to_i

scores = []

n.times do |i|
  print "Enter score #{i + 1}: "
  scores << gets.chomp.to_i
end

average = scores.sum.to_f / scores.size

if average >= 90
  grade = "A"
elsif average >= 80
  grade = "B"
elsif average >= 70
  grade = "C"
elsif average >= 60
  grade = "D"
else
  grade = "F"
end

puts
puts "Results:"
puts "  Average : #{average.round(2)}"
puts "  Grade   : #{grade}"
puts "  Highest : #{scores.max}"
puts "  Lowest  : #{scores.min}"
