precision highp float;

out vec4 fragColor;
uniform vec2 u_resolution;

float h3(float x){
    return (3.0-2.0*x)*x*x;
}

const uint UINT_MAX = 0xffffffffu;
uvec3 k = uvec3(0x456789abu, 0x6789ab45u, 0x89ab4567u);
uvec3 u = uvec3(1, 2, 3);
uvec2 uhash22(uvec2 n){
    n ^= (n.yx << u.xy);
    n ^= (n.yx >> u.xy);
    n *= k.xy;
    n ^= (n.yx << u.xy);
    return n * k.xy;
}
uvec3 uhash33(uvec3 n){
    n ^= (n.yzx << u);
    n ^= (n.yzx >> u);
    n *= k;
    n ^= (n.yzx << u);
    return n * k;
}
vec2 hash22(vec2 p){
    uvec2 n = floatBitsToUint(p);
    return vec2(uhash22(n)) / vec2(UINT_MAX);
}
vec3 hash33(vec3 p){
    uvec3 n = floatBitsToUint(p);
    return vec3(uhash33(n)) / vec3(UINT_MAX);
}
float hash21(vec2 p){ //２次元ベクトルに対してフロートを一つ返す
    uvec2 n = floatBitsToUint(p);
    return float(uhash22(n).x) / float(UINT_MAX);
    //nesting approach
    //return float(uhash11(n.x+uhash11(n.y)) / float(UINT_MAX)
}
float hash31(vec3 p){
    uvec3 n = floatBitsToUint(p);
    return float(uhash33(n).x) / float(UINT_MAX);
    //nesting approach
    //return float(uhash11(n.x+uhash11(n.y+uhash11(n.z))) / float(UINT_MAX)
}


void main(){
    vec2 p = gl_FragCoord.xy / u_resolution.x;
    p = 10.0*p;
    int ipx = int(floor(p.x));
    int ipy = int(floor(p.y));
    //p = fract(p);

    vec4 bl = vec4(vec3(hash21(floor(p))), 1.0);
    vec4 br = vec4(vec3(hash21(floor(p)+vec2(1,0))), 1.0);
    vec4 tl = vec4(vec3(hash21(floor(p)+vec2(0,1))), 1.0);
    vec4 tr = vec4(vec3(hash21(floor(p)+vec2(1,1))), 1.0);

    vec4 bot = mix(bl, br, h3(fract(p.x)));
    vec4 top = mix(bl, br, h3(fract(p.x)));
    vec4 v = mix(bl, br, h3(fract(p.x)));

    fragColor = bot;
/*
    vec4 colLB = vec4(0.6431, 0.7216, 0.9608, 1.0);
    vec4 colRB = vec4(0.7451, 0.8902, 0.9843, 1.0);
    vec4 colLT = vec4(0.4235, 0.5608, 0.9725, 1.0);
    vec4 colRT = vec4(1.0, 1.0, 1.0, 1.0);

    vec4 colB;
    vec4 colT;

    fragColor = mix(colB, colT, h3(p.y) );

    if(ipx%2 == 0 && ipy%2 == 0){
        colB = mix(colLB, colRB, h3(p.x));
        colT = mix(colLT, colRT, h3(p.x));
        fragColor = mix(colB, colT, h3(p.y));
    }else if(ipx%2 == 1 && ipy%2 == 0){
        colB = mix(colRB, colLB, h3(p.x));
        colT = mix(colRT, colLT, h3(p.x));
        fragColor = mix(colB, colT, h3(p.y));
    }else if(ipx%2 == 0 && ipy%2 == 1){
        colB = mix(colLT, colRT, h3(p.x));
        colT = mix(colLB, colRB, h3(p.x));
        fragColor = mix(colB, colT, h3(p.y));
    }else if(ipx%2 == 1 && ipy%2 == 1){
        colB = mix(colRT, colLT, h3(p.x));
        colT = mix(colRB, colLB, h3(p.x));
        fragColor = mix(colB, colT, h3(p.y));
    }
    */
}