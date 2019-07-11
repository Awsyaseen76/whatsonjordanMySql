(function () {
    angular
        .module('whatsOnJordan')
        // .service('categoriesService', categoriesService);
        .service('getterService', getterService);

    function getterService($http) {
        this.getEventHelpers = getEventHelpers;
        this.getMemberProfileHelpers = getMemberProfileHelpers;
        this.getAllCategories = getAllCategories;
        this.getAllSubCategories = getAllSubCategories;
        this.getAllAgeGroups = getAllAgeGroups;
        this.getAllGrades = getAllGrades;
        this.getAllExpenseTypes = getAllExpenseTypes;
        this.getPhoneTypes = getPhoneTypes;


        function init() { }
        init();

        function getEventHelpers(organizerId){
            return $http.get('/api/getterService/getEventHelpers/'+organizerId);
        }

        function getMemberProfileHelpers(){
            return $http.get('/api/getterService/getMemberProfileHelpers');
        }

        function getAllCategories() {
            return $http.get('/api/getterService/getAllCategories');
        }

        function getAllSubCategories() {
            return $http.get('/api/getterService/getAllSubCategories');
        }

        function getAllAgeGroups() {
            return $http.get('/api/getterService/getAllAgeGroups');
        }

        function getAllGrades() {
            return $http.get('/api/getterService/getAllGrades');
        }

        function getAllExpenseTypes(){
            return $http.get('/api/getterService/getAllExpenseTypes');
        }

        function getPhoneTypes(){
            return $http.get('/api/getterService/getPhoneTypes');
        }


    }

})();