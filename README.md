# BuySell-IIITH

## Login, Registration, Profile page
1. Normal login and registration is followed
2. For CAS login, the email is saved and the user is redirected to another page to complete registration, and add a password in case they decide to login normally

## Reviews 
Reviews for a seller are the average of all the reviews given to an item sold by that seller

## Orders
While adding an item to the cart, the quantity can be updated as well. This quantity is subtracted from the actual item only when the order is completed. 

## OTP regeneration
OTP regeneration follows as per the doc, but it also handles the following case : In case two users order the last few items of the same object, but they are sold to only one of them, when the other user regenerates the OTP, he/she will be wanred about the same, and that item will be removed from the order. If the order then becomes empty, the order itself is deleted.