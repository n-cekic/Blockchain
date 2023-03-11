// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract SimpleStorage {
    uint256 favoriteNumber;

    struct Person {
        uint256 favoriteNumber;
        string name;
    }

    Person[] public people;

    mapping(string => uint256) public nameToFavoriteNumbe;

    function store(uint256 _favNum) public {
        favoriteNumber = _favNum;
    }

    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }

    function addPerson(string memory _name, uint256 _favNum) public {
        people.push(Person(_favNum, _name));
        nameToFavoriteNumbe[_name] = _favNum;
    }
}
