var lineAlertAppFilters = angular.module('lineAlertAppFilters', []);

lineAlertAppFilters.filter("line", function(){
    return function(input){
        var num = new Number(input);

        if(isNaN(num)){
            return "";
        }
        else if(num == 0)
        {
            return "Pick";
        }
        else if(num > 0){
            return "+" + input;
        }
        else {
            return input;
        }
    }
});