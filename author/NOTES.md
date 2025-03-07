


```

: divide ( n n -- n )
    DUP 0 == [ "Illegal Division by 0" !throw ] ?COND
    /
;

: modulo ( n n -- n )
    DUP 0 == [ "Illegal Modulo by 0" !throw ] ?COND
    %
;



```


