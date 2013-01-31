PasswordStrength
=================

Description
-----------
PasswordStrength is a jQuery plugin to measure the strength of a password typed by the user.

By default it will show the percentage of the password strength and the time that it takes to be cracked by brute-force attack, the time is calculated taking into account the fastest brute-force designed machine until December 2012 [Brute Force 348 bllion hashes per second](http://hackaday.com/2012/12/06/25-gpus-brute-force-348-billion-hashes-per-second-to-crack-your-passwords/).

Author
------
**João Parreira**
<joaofrparreira@gmail.com>

Version
-------
0.1.3 Initial Release

Requirements
------------
Created with jQuery JavaScript Library v1.8.3, but should work with older releases


How to Use
----------
```html
    <input size="50" maxlength="100" name="password" id="password" type="password">
    <div id="passwordStrength"></div>
    <script language="javascript" type="text/javascript">
        jQuery(function(){
            jQuery("#password").passwordStrength({
                targetDiv:'passwordStrength',
                text:{
                    year:'year|years'   //This allows to change the language of the plugin			
                }
            });
        });
    </script>
```



Inspiration
-----------
http://danpalmer.me/jquery-complexify/
http://unwrongest.com/projects/password-strength/



Versioning
----------

For transparency and insight into our release cycle, and for striving to maintain 
backward compatibility, PasswordStrength will be maintained under the Semantic Versioning 
guidelines as much as possible.

Releases will be numbered with the follow format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backward compatibility bumps the major
* New additions without breaking backward compatibility bumps the minor
* Bug fixes and misc changes bump the patch

For more information on SemVer, please visit http://semver.org/.


Copyright and license
---------------------

PasswordStrength (c) 2013 João Parreira <joaofrparreira@gmail.com>

Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License
  
This work is licensed under the Creative Commons 
Attribution-NonCommercial-ShareAlike 3.0 Unported License. 
To view a copy of this license, visit 
http://creativecommons.org/licenses/by-nc-sa/3.0/ or send a letter to 
Creative Commons, 444 Castro Street, Suite 900, Mountain View, California, 
94041, USA.
