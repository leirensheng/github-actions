#!/bin/bash
content = $(cat ./responseData)
echo http://www.pushplus.plus/send?token=ff7273be19b84a01b99f47cedbfb8694&title=Bank&&content=$content
