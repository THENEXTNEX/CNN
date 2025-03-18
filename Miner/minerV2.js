//import library

var robot = require('robotjs');
var half_second = 500;
var one_second = 1000;  
var default_speed = 1;

//All x y positions required to bank
var compass_x = 2365;
var compass_y = 50;

var spellbook_x = 2500;
var spellbook_y = 1090;

var home_x = 2325;
var home_y = 1125;

function main(){
    console.log("Starting...");
    //Give time to swap to client
    sleep(one_second * 4);

    //Init bot so it can be started anywhere in game
    initialise();

    while(true){

        
        //Check if invy full
        if(checkFullInv()){
            bank();
        }

        //Find the rock
        var rock = findRock();

        //If the rock is not found, rotate to give more options
        if(rock == false){
            rotateCamera();
            continue;
        }

        //Move to given positions to mine ore
        console.log("Reached before click");
        console.log("Rock.x = " + rock.x + " Rock.y = " + rock.y);
        moveAndClick(rock.x, rock.y, default_speed, half_second);
        console.log("Should have clicked");

        sleep(one_second * 5);

        
    }
    
}

//No sleep function in built to js
function sleep(ms){
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0 ,0, ms);
}

function findRock(){

    //init vars
    var x = 850;
    var y = 350;
    var width = 1550;
    var height = 700;
    var rockColours = ["6a6363","968c8b","988d8d"];

    //Take a screenshot of a smaller area to compute faster
    var img = robot.screen.capture(x, y, width, height);

    //Takes random x and y pixels within the screenshot taken so there is no bias to ores in the top left of the screenshot.
    //Pixel matches the colours to see if it matches the array, if so, return the x and y pos, else false positive.
    for(var i = 0; i < 250; i++){
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
    sleep(one_second/10);
    //Check colour of action text
    var check_x = screen_x + 60;
    var check_y = screen_y + 30;
    var slack = 5;

    //Checks the text box to check for Cyan colour as this indicates an action
    for(var i = check_x; i < check_x + slack; i++){
        for(var j = check_y; j < check_y + slack; j++){
            
            var pc = robot.getPixelColor(i, j);

            console.log("Pixel colour @ x: " + i + "y: " + j + ": " + pc);
            if(actionTextColour.includes(pc)){
                return true;
            }
        }
    }

    return false;
}

function checkFullInv(){

    //Init variables
    var inv_x = 2465;
    var inv_y = 1350;
    var itemTextColour = "ff9040";
    var text_x = 2483;
    var text_y = 1383;
    var slack = 5;

    //Move mouse to hover last invy slot, if and item is there, the orange game text will show slightly below item
    robot.moveMouseSmooth(inv_x,inv_y,1);
    sleep(one_second/10);

    //Check pixels around the area in which the game text colour should appear
    //Return true (Flag == 1) if the colour is found
    for(var i = text_x - slack; i < text_x + slack; i++){
        for(var j = text_y - slack; j < text_y + slack; j++){
            
            var pc = robot.getPixelColor(i,j);
            console.log("Pixel colour @ x: " + i + "y: " + j + ": " + pc);
            if(itemTextColour.includes(pc)){
                return true;
            }
        }
    }
    
    return false;

}

function teleHome(){

    //Open spellbook
    moveAndClick(spellbook_x, spellbook_y, default_speed, one_second);

    //Teleport home
    moveAndClick(home_x, home_y, default_speed, one_second);

    //Click compass to face north
    moveAndClick(compass_x, compass_y, default_speed, one_second);

    sleep(one_second * 3);
}

function initialise(){

    var portal_init_x = 960;
    var portal_init_y = 680;

    teleHome();
    robot.keyTap('f1');

    portalNexus(portal_init_x, portal_init_y);
    
}

function bank(){

    var bank_window_x = 1925;
    var bank_window_y = 760;

    var deposit_x = 1320;
    var deposit_y = 1010;

    var portal_bank_x = 420;
    var portal_bank_y = 650;

    teleHome();

    //Click bank window
    moveAndClick(bank_window_x, bank_window_y, default_speed, one_second);

    sleep(one_second * 6);

    //Deposit all
    moveAndClick(deposit_x, deposit_y, default_speed, one_second+half_second);

    //Close bank, swap to inventory and click on portal nexus
    robot.keyTap('escape');
    robot.keyTap('f1');

    portalNexus(portal_bank_x, portal_bank_y);
    
}

function portalNexus(x ,y){
    
    //Relevant variables
    var mining_icon_x = 1095;
    var mining_icon_y = 640; 

    var VWM_x = 950;
    var VWM_y = 638;

    var tele_x = 1290;
    var tele_y = 740;

    moveAndClick(x, y, default_speed, one_second);

    sleep(one_second * 8); 
    
    //Click mining icon
    moveAndClick(mining_icon_x, mining_icon_y, default_speed, one_second);
    
    //Select Varrock West Mine (VWM)
    moveAndClick(VWM_x, VWM_y, default_speed, one_second);

    //Click teleport button
    moveAndClick(tele_x, tele_y, default_speed, one_second+half_second);

    sleep(one_second);
}

//Function to process the moving and clicking of mouse 
function moveAndClick(x,y,speed, ms){

    console.log("x = " + x + " y = " + y + " speed = " + speed + " ms = " + ms);
    robot.moveMouseSmooth(x,y,speed);
    sleep(ms);
    robot.mouseClick();
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