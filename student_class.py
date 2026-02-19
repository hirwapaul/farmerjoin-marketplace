class student:
    def __init__(self, name, marks):
        self.name = name
        self.marks = marks
    
    def check_results(self):
        if self.marks > 50:
            print(f'Pass: {self.name}')
        else:
            print(f'Fail: {self.name}')
    
    def get_marks(self):
        print(f'Student: {self.name}')
        print(f'Marks: {self.marks}')
        
# Get input from user
name = str(input('Enter name: '))
marks = int(input('Enter marks: '))

# Create student object
obj = student(name, marks)

# Display student info
obj.get_marks()

# Check results
obj.check_results()
