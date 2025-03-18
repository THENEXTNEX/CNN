//import library

var robot = require('robotjs');

function main(){
    console.log("Starting...");
    sleep(4000);
    console.log("Done");

    while(true){

        var rock = findRock();

        //checking if tree not found
        if(rock == false){
            rotateCamera();
            continue;
        }
        //First click
        robot.moveMouseSmooth(rock.x, rock.y,1);
        robot.mouseClick();

        //Drop log
        sleep(5000);
        dropRock();
    }
}

function sleep(ms){
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0 ,0, ms);
}

function dropRock(){
    
    //init vars
    var inventory_x = 2340;
    var inventory_y = 1135;
    var drop_y = 1176;
    var log_colour = "7b7272";
    var pixel_color = robot.getPixelColor(inventory_x, inventory_y);
    console.log("Inventory rock colour is: " + pixel_color);

    var wait_cycles = 0;
    var max_wait_cycles = 3;
    while(pixel_color != log_colour && wait_cycles < max_wait_cycles){
        //Wait a bit to check if the chopping finishes
        sleep(1000);
        pixel_color = robot.getPixelColor(inventory_x, inventory_y);
        //incr counter
        wait_cycles++;
    }

    //Drops logs
    if(pixel_color == log_colour){
        robot.moveMouseSmooth(inventory_x, inventory_y,1);
        robot.mouseClick('right');
        robot.moveMouseSmooth(inventory_x, drop_y,1);
        robot.mouseClick();
    };
    
}

function findRock(){

    //init vars
    var x = 850;
    var y = 320;
    var width = 1650;
    var height = 820;
    var rockColours = ["6a6363","968c8b","988d8d"];

    var img = robot.screen.capture(x, y, width, height);

    for(var i = 0; i < 100; i++){
        var random_x = getRandomInt(0, width-1);
        var random_y = getRandomInt(0, height-1);
        var screenshot = img.colorAt(random_x, random_y);

        if(rockColours.includes(screenshot)){
            var screen_x = random_x + x;
            var screen_y = random_y + y;
            
            if(confirmRock(screen_x, screen_y)){
                console.log("Found rock at: " + screen_x + ", " + screen_y + " colour " + screenshot);
                return {x: screen_x, y:screen_y};
            }else{
                console.log("Unconfirmed rock at: " + screen_x + ", " + screen_y + " colour " + screenshot);
            }
            
        }
    }

    return false;
}

//Rotates camera a small amout to the right
function rotateCamera(){
    console.log("Rotating Camera");
    robot.keyToggle('right', 'down');
    sleep(1000);
    robot.keyToggle('right', 'up');
}

function confirmRock(screen_x, screen_y){
    //Colour array
    var actionTextColour = ["00ffff"];

    //Move the mouse to the given coords
    robot.moveMouseSmooth(screen_x,screen_y, 1);
    //Wait
    sleep(300);
    //Check colour of action text
    var check_x = screen_x + 60;
    var check_y = screen_y + 30;
    var flag = 0;

    for(var i = check_x; i < check_x + 5; i++){
        for(var j = check_y; j < check_y + 5; j++){
            
            var pc = robot.getPixelColor(i, j);

            console.log("Pixel colour @ x: " + i + "y: " + j + ": " + pc);
            if(actionTextColour.includes(pc)){
                flag = 1;
            }
        }
    }

    if(flag == 1){
        return true
    }else{
        return false;
    }
}

function testScreen(){

    var size_x = 2560;
    var size_y = 1440;
    var img = robot.screen.capture(0,0,size_x, size_y);

    var pixel_color = img.colorAt(24,17);
    console.log(pixel_color);
}

function getRandomInt(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
//testScreen();
main();