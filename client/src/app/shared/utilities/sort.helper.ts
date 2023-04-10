import {Person} from "shared/models/person";
import {Employee} from "shared/models/employee.model";
import {Customer} from "shared/models/customer.model";

// Sort by firstName, if inconclusive sort by lastName
export function sortPeople<T extends Person>(people: T[]) {
  return people
    .sort((person1, person2) =>
      person1.firstName < person2.firstName
        ? -1 : person1.firstName > person2.firstName
          ? 1 : person1.lastName < person2.lastName
            ? -1 : person1.lastName > person2.lastName
              ? 1 : 0
    )
}

export function filterBySearchValue<T extends Person>(
  people: T[],
  searchValue: string,
  personFilter: (person: T, searchValue: string) => boolean
) {
  if (!people) return [];
  if (!searchValue) return sortPeople<T>(people.slice());
  return sortPeople<T>(people.filter(person => personFilter(person, searchValue.toLowerCase())));
}

export function employeeFilter(employee: Employee, searchValue: string) {
  return (employee.firstName.toLowerCase().indexOf(searchValue) > -1)
    || (employee.lastName.toLowerCase().indexOf(searchValue) > -1)
    || (employee.username.toLowerCase().indexOf(searchValue) > -1)
}

export function customerFilter(customer: Customer, searchValue: string) {
  return (customer.firstName.toLowerCase().indexOf(searchValue) > -1)
    || (customer.lastName.toLowerCase().indexOf(searchValue) > -1)
    || (customer.organizationName.toLowerCase().indexOf(searchValue) > -1)
}
