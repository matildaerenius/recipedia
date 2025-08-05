package com.matildaerenius.security.filter;

import com.matildaerenius.entity.User;
import com.matildaerenius.repository.UserRepository;
import com.matildaerenius.security.util.JwtTokenProvider;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;


    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {

        String path = req.getServletPath();

        if (path.startsWith("/auth")) {
            chain.doFilter(req, res);
            return;
        }

        String header = req.getHeader(jwtTokenProvider.getJwtHeader());

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                String username = jwtTokenProvider.getUsernameFromToken(token);
                User user = userRepository.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));

                Authentication auth = new UsernamePasswordAuthenticationToken(
                        user.getUsername(), null, authorities
                );

                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (JwtException e) {
                res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT");
                return;
            }
        }

        chain.doFilter(req, res);
    }
}