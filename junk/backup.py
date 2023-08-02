import random

def main():
    pizzaSize = input("What size, small, medium, or large? ")
    if pizzaSize.lower() == "small":
        pizzaPrice = 3.49
    elif pizzaSize.lower() == "medium":
        pizzaPrice = 5.99
    elif pizzaSize.lower() == "large":
        pizzaPrice = 9.99
    else:
        print("Invalid size type")
        return
    crustType = input("What type of crust? ")
    cheeseType = input("What type of cheese? ")
    toppingType = input("What topping? ")

    print("Medium Caesars:")
    print("Order number "+str(random.randint(10,999))+"\n")
    print("Pizza - "+pizzaSize.capitalize())
    print("    Crust: "+crustType.capitalize())
    print("    Cheese: "+cheeseType.capitalize())
    print("    Topping: "+toppingType.capitalize()+"\n")
    print("Subtotal - $"+str(pizzaPrice))
    print("Total - $"+str(pizzaPrice+2))

main()
