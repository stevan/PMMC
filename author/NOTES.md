


- need to define

























## Decompilation

### IF THEN
```
0 > IF "Yes" .say THEN
```
```
    0 >              //        ( #t ) (   )
    [                // `IF    (    ) (   ) enter compilation mode,
       >A            // `IF    (    ) (   ) ( A1 ) push current address on the stack
    ]+               // `IF    (    ) ( $ ) and leave the top of the address stack on the control stack
    ?BRANCH!         // IF     ( #t ) ( $ )
    "Yes" .say       //
    [                // `THEN  (    ) (   )
        >A           // `THEN  (    ) (   ) ( A1 A2 ) << A2 will end up in first to call ]+
    ]-               // `THEN  (    ) (   )
                     // THEN   (    ) (   )
```
```
0 > IF "Yes" .say ELSE "No" .say THEN
```
### IF ELSE THEN
```
    0 >              //        ( #t ) (   )
    [                // `IF    (    ) (   ) enter compilation mode,
       >A            // `IF    (    ) (   ) ( A1 ) push current address on the stack
    ]+               // `IF    (    ) ( $ ) and leave the top of the address stack on the control stack
    ?BRANCH!         // IF     ( #t ) ( $ )
    "Yes" .say       //
    [                // `ELSE  (    ) (   ) enter compilation mode,
       >A            // `ELSE  (    ) (   ) ( A1 A2 ) push current address on the stack
    ]+               // `ELSE  (    ) ( $ ) and leave the top of the address stack on the control stack
    ?BRANCH!         // ELSE   ( #t ) ( $ )
    "No" .say        //
    [                // `THEN  (    ) (   )
        >A           // `THEN  (    ) (   ) ( A1 A2 A3 ) << A3 will end up in first to call ]+
    ]-               // `THEN  (    ) (   )
                     // THEN   (    ) (   )
```

### DO LOOP

```
10 1 DO "Hello" .say LOOP
```
```
    10 0              //       (      10 0 ) (        )
    HERE!             // DO    (      10 0 ) (      L ) // when branching to this label, it is executed again
    SWAP              // DO    (      0 10 ) (      L )
    >R                // DO    (         0 ) (   L 10 )
    1 + >R            // DO    (           ) ( L 10 1 )
    "Hello" .say
    <R                // LOOP  (         1 ) (   L 10 )
    <R                // LOOP  (      1 10 ) (      L )
    OVER OVER         // LOOP  ( 1 10 1 10 ) (      L )
    >                 // LOOP  (   1 10 #f ) (      L )
    ?BRANCH!          // LOOP  (      1 10 ) (        ) // consumes the label and jumps back
```

### BEGIN UNTIL

```
BEGIN


UNTIL
```
```
```

### BEGIN WHILE REPEAT

```
BEGIN

WHILE

REPEAT
```
```
```


