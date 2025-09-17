# Project Structure /src

```
src
- app
- components
    - actions
    - ui
- db
- docs
- hooks
- lib
- queries
- schemas
```

- `app` folder, used mainly for the main UI and API stuff
- `components`, for UI frontend components. Can have logic stuff inside it
  - `actions`, currently unused
  - `ui`, component level items like buttons, avatars, card, etc from shadcn
- `db`, Drizzle schemas, only used for an API call, so accuracy to DB schema is not an issue
- `docs`, Documentation folder that hosts this file and dependency graphs (for now)
- `hooks`, has use-mobile.ts that used somewhere in this project for responsive usage
- `lib`, general reusable functions, can add own function
- `queries`, global level tanstack queries
- `schemas`, global level reusable Zod schemas

# Project Structure /src/app

```
src/app
- (logged-in)
    - admin
        - users
            - _components
            - add
    - categories
        - _components
        - add
    - employees
        - _components
        - [id]
            - edit
        - add
    - reimbursements
        - _components
        - [id]
        - add
    - settings
- api
- forgot-password
- lib
```
+ `src/app` is a page that has login page on it and global layout
+ `(logged-in)`, every pages that require login resides in here
    + `(logged-in)/dashboard`, the dashboard page
        + `(logged-in)/dashboard/admin`, the admin priviliges check section. This section has no page
            + `(logged-in)/dashboard/admin/users/`, the View Users Page, where supabase users table is
                + `(logged-in)/dashboard/admin/users/_components`, the local components page for dropdown menu
                + `(logged-in)/dashboard/admin/users/add`, the add users page
        + `(logged-in)/dashboard/categories`, the view categories page
            + `(logged-in)/dashboard/categories/_components`, the local components page for dropdown menu
            + `(logged-in)/dashboard/categories/add`, the add categories page
        + `(logged-in)/dashboard/employees`, the view employees page
            + `(logged-in)/dashboard/employees/_components`, the local components page for dropdown menu
            + `(logged-in)/dashboard/employees/[id]`, the view individual employees by id page
                + `(logged-in)/dashboard/employees/[id]/edit`, the edit employees page
            + `(logged-in)/dashboard/employees/add`, the add employees page
        + `(logged-in)/dashboard/reimbursements`, the view reimbursements page
            + `(logged-in)/dashboard/reimbursements/_components`, the local components page for dropdown menu and query components
            + `(logged-in)/dashboard/reimbursements/[id]`, the view individual reimbursements by id page
            + `(logged-in)/dashboard/reimbursements/add`, the add reimbursements page
                + `(logged-in)/dashboard/reimbursements/add/_components`, the local components such as query cell component for selecting combobox with queried data
                + `(logged-in)/dashboard/reimbursements/add/_queries`, the local Tanstack queries for the page
    + `(logged-in)/dashboard/settings`, the user settings page to change password, email or edit profile picture
+ `api`, every API endpoint resides here
+ `forgot-password`, special forgot-password page
+ `lib`, currently unused

# Project Structure /src/app/api/

```
src/app/api
- v1
    - auth
        - admin
            - [id]
                - update-avatar
        - confirm-otp
        - logout
        - signin
        - update-credentials
            - update-avatar
    - banks
    - categories
        - [id]
    - companies
    - employees
        - [empID]
            - disable
            - enable
            - grant-admin
            - revoke-admin
            - set-uuid
        - get-id/[userUID]
    - employments
    - reimbursements
        - [id]
            - approve
            - full-data
            - notes
            - reject
            - void
    - religions
    - roles
```

+ `src/app/api/`, the API config part with supabase configs
+ `src/app/api/v1`, the main API folder for now
    + `auth`, a folder that has multiple auth centered endpoints
        + `auth/admin`, GET for list all users, POST for create a new user
            + `auth/admin/[id]`, GET for individual user with id
                + `auth/admin/[id]/update-avatar`, POST to update avatar from user with ID
            + `auth/confirm-otp`, unused folder at the moment
            + `admin/logout`, POST to sign out from website
            + `admin/signin`, POST to sign in to website
            + `admin/update-credentials`, PUT to update **own** email/password
                + `admin/update-credentials/update-avatar`, POST to update **own** profile picture
    + `banks`, GET to view all banks
    + `categories`, GET to view all categories, POST to add a category
        `categories/[id]`, GET to view individual category, DELETE to remove a category
    + `companies`, GET to view all companies
    + `employees`, GET to view all employees, POST to add an employee
        + `employees/[empID]`, GET to obtain individual employee ID, PUT to edit employee information
            + `employees/[empID]/disable` PUT to disable for employee
            + `employees/[empID]/enable` PUT to enable for employee
            + `employees/[empID]/grant-admin` PUT to grant admin for employee
            + `employees/[empID]/revoke-admin` PUT to revoke admin for employee
            + `employees/[empID]/set-uuid` PUT to set Supabase user uuid for employee
        + `employees/get-id/[userUID]`,GET to obtain employee code from supabase user id
    + `employments`, GET to view all employments
    + `reimbursements`, GET to view all reimbursements, POST to add a reimbursement
        + `reimbursements/id`, GET to view individual reimbursement, PUT to edit the reimbursement
            + `reimbursements/approve`, PUT to approve reimbursement
            + `reimbursements/full-data`, GET to view full-data of a reimbursement
            + `reimbursements/notes`, GET to view notes from a reimbursement
            + `reimbursements/reject`, PUT to reject reimbursement
            + `reimbursements/void`, PUT to void reimbursement
    + `religions`, GET to view all religions
    + `roles`, GET to view all roles




            

