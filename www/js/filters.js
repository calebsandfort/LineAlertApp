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

lineAlertAppFilters.filter("nflWeekNumber", function () {
    return function (num) {
        if (isNaN(num)) {
            return "";
        }
        else if (num > 17) {
            switch (num) {
                case 18:
                    return "Wild-Card Round";
                    break;
                case 19:
                    return "Divisional Round";
                    break;
                case 20:
                    return "Championship Round";
                    break;
                case 21:
                case 22:
                    return "Super Bowl";
                    break;
                default:
                    return "";
                    break;
            }
        }
        else {
            return  "Week " + num;
        }
    }
});