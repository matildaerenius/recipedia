package com.matildaerenius.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Unit {
    ST, KG, HG, G, PACK, L, DL, CL, ML, MSK, TSK, KRM;

    @JsonCreator
    public static Unit from(String v) {
        if (v == null) return null;
        return Unit.valueOf(v.trim().toUpperCase());
    }

    @JsonValue
    public String toJson() { return name(); }
}
