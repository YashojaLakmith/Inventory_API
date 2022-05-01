--INVENTORY CONTROL API--

This API was build with NodeJS, Express framework and MongoDB to demonstrate and assist in basic inventory control procedures.

Configure the .env file first in the root:
    -   MONGO_URI => The MongoDB connection string
    -   JWT_SECRET_KEY => Key for JWT encryption
    -   JWT_LIFETIME => Expiration period of JSON Web Token issued upon a successfull login.
    -   PORT => Port of the server to listen on. The sever will run on port 3000 if this was not specified.

This API has following functionalities:
    -   Create users and assign them with Admin, Edit Only and View Only privileges to perform tasks.
    -   Set users active or inactive.
    -   Change user passwords, information and delete accounts.
    -   Create inventory items and assign them into 4 subgroups, if required.
    -   Set items active or inactive.
    -   Change item information.
    -   Get units from items, add to items or completely remove the item from the database.
    -   Automatically log events performed relating to items and users.
    -   View users, items and logs and perform search queries.


Routes and request formats (All requests and responses will be sent as JSON)

    -   (POST)     /api/v1/auth/login/
        Logs in the user. Request body can be passed as follows.                    
            {
                userID:....,                #Required
                password:.....              #Required
            }
    -   (POST)     /api/v1/users/register/     
        You have to manually create a Admin type account in MongoDB for the first time and login using it to register other users. Request body can be passed as follows. Requires admin privileges. Optional empty fields will be ignored and assigned with default values.
            {
                userID:.......,             #Required
                password:.....,             #Required
                confirmPassword:.......,    #Required
                privileges:......,          #Choose out from 'Admin', 'Edit only' or 'View only'. Default: 'View only'
                activeUser:.....            #Choose from 'true' of 'false'. Default: 'false'
            }
    
    -   (GET)      /api/v1/users/view/
        Shows the user information. userID can be added at the end of the url to search for specified user, or following query string parameters can be passed to filter the search. Requires admin privileges.
            # alias
            # userID
            # privilege

    -   (PATCH)    /api/v1/users/modify/:userID
        Modifies the information of the user specified in userID. Request body can be passed as follows. Requires admin privileges.
            {
                "password":....,            #Required when modifying users with admin privileges.
                "alias":....,               #Optional
                "privileges":....,          #Optional
                "activeStatus":....         #Optional
            }

    -   (PATCH)    /api/v1/users/password/:userID
        Modifies user password of the user specified in userID. Request body can be passed as follows. Requires admin privileges.
            {
                "password":....,            #This field is required when changing password of a user with admin privileges.
                "newPassword":....,         #Required
                "confirmPassword":....      #Required
            }

    -   (DELETE)    /api/v1/users/:userID
        Deletes the user account. Request body can be passed as follows. Requires admin privileges.
            {
                "password":....,            # Only applicable for users with admin privileges
            }


    -   (GET)       /api/v1/inventory/view/
        Shows the list of information of available items. itemID can be passed at the end of the url to view the information of that item or, following query string parameters can be passed to filter the search. Requires view only privileges or higher.
            # itemID
            # itemName
            # mainCategory
            # subCategory1
            # subCategory2
            # subCategory3
            # activeStatus

    -   (POST)      /api/v1/inventory/create/
        Creates new item with provided information. Request body can be passed as follows. Requires Edit only privileges or higher. Optional empty fields will be ignored and assigned with default values. 
            {
                "itemID":.... ,             #Required
                "itemName":....  ,          #Required
                "mainGroup":.....,          #Optional. Default: 'General'
                "subGroup1":.....,          #Optional. Default: 'General'
                "subGroup2":.....,          #Optional. Default: 'General'
                "subGroup3":.....,          #Optional. Default: 'General'
                "itemAmount":....,          #Optional. Default: 0
                "activeStatus":.....        #Optional. Default: 'false'
            }

    -   (PATCH)      /api/v1/inventory/modify/:itemID
        Modifies the item information of the itemID provided. Request body can be passed as follows. Requires Edit only privileges or higher. All fields are optional. Empty fields will be ignored.
            {
                "itemName":....  ,       
                "mainGroup":.....,       
                "subGroup1":.....,      
                "subGroup2":.....,       
                "subGroup3":.....,       
                "itemAmount":....,       
                "activeStatus":.....     
            }

    -   (PATCH)      /api/v1/inventory/add/:itemID
        Adds specified amountof units to the itemID provided. Request body can be passed as follows. Requires Edit only privileges or higher.
            {
                "amountOfItems":....  ,     #Required       
                "remarks":.....,            #Optional            
            }

    -   (PATCH)      /api/v1/inventory/get/:itemID
        Gets specified amountof units from the itemID provided. Request body can be passed as follows. Requires Edit only privileges or higher.
            {
                "amountOfItems":....  ,     #Required       
                "remarks":.....,            #Optional            
            }

    -   (DELETE)      /api/v1/inventory/delete/:itemID
        Deletes the item with the itemID provided. Request body can be passed as follows. Requires Edit only privileges or higher.
            {
                "remarks":.....             #Optional
            }
    
    -   (GET)       /api/v1/logs/users/
        Shows the events performed relatiing to the user accounts. Log _id can be passed to the end of url to view specified log only or, following query string parameters can be passed to filter the search. Requires admin privileges.
            # adminUID          (User who made changes)
            # userID            (To whom changes were made)
            # modification      (Keyword of the modification)

    -   (GET)       /api/v1/logs/items/
        Shows the events performed relatiing to the items. Log _id can be passed to the end of url to view specified log only or, following query string parameters can be passed to filter the search. Requires view only privileges or higher.
            # userID            (User who made changes)
            # itemID            (To which item changes were made)
            # modification      (Keyword of the modification)


--------------------------------------------------------------------------------------------------------------

Have a nice day!