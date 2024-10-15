strType = type("")
intType = type(0)
floatType = type(0.0)

path = [7.22,"-124",4,"90",3,"90",5,"90",3]



def compile(path: list):
    for elem in path:
        elemType = type(elem)
        if elemType == strType:
            turn(elem)
        elif elemType == intType or elemType == floatType:
            drive(elem)
        else:
            print(f"Unknown command: {elem} / {type(elem)}")
        
            
def turn(degree: str):
    degree = int(degree)
    if degree > 0:
        print(f"Turning right by: {degree}°")
    if degree < 0:
        print(f"Turning left by: {degree}°")
        
def drive(meter: int):
    print(f"Drive by: {meter}m")
    
    
if __name__ == "__main__":
    compile(path)